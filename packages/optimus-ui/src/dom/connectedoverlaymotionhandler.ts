/**
 * Extra time granted on top of the longest running animation before tracking is given up.
 * Guards against animations that stall - paused, or never resumed - short of their end time.
 */
const MOTION_SETTLE_SLACK = 100;

const isSettlingAnimation = (animation: Animation) => (animation.playState === 'running' || animation.playState === 'paused') && Number.isFinite(Number(animation.effect?.getComputedTiming().endTime));

/**
 * Wall clock time left on an animation. Its timeline runs at the playback rate, so animation
 * time has to be scaled back to real time - a rate of 0.5 takes twice as long to get there.
 */
const getRemainingTime = (animation: Animation) => Math.max(Number(animation.effect?.getComputedTiming().endTime) - Number(animation.currentTime ?? 0), 0) / (Math.abs(animation.playbackRate) || 1);

const getMotionParent = (node: Element): Element | null => {
    const root = node.getRootNode();

    // parentElement stops at a shadow root; step over it to the host that carries the motion.
    return node.parentElement ?? (root as ShadowRoot).host ?? null;
};

/**
 * Keeps an overlay aligned to its target while the target or one of its ancestors is animating.
 *
 * An overlay is positioned from the target's box, so any animation moving that box - a dialog
 * or drawer entering, a panel collapsing - leaves the overlay behind. Animations of descendants
 * are ignored: they cannot move the target.
 */
export class ConnectedOverlayMotionHandler {
    element: any;

    listener: any;

    animations: Animation[] = [];

    tracking: boolean = false;

    frame: any;

    timeout: any;

    /** Invalidates the pending reactions of earlier binds, which must not settle this one. */
    generation: number = 0;

    constructor(element: any, listener: any = () => {}) {
        this.element = element;
        this.listener = listener;
    }

    bindMotionListener() {
        this.unbindMotionListener();

        this.animations = this.getTargetAnimations();

        if (!this.animations.length) {
            return;
        }

        const generation = ++this.generation;

        this.tracking = true;

        // allSettled: a cancelled animation rejects, and it settles the target just as an ended one does.
        Promise.allSettled(this.animations.map((animation) => animation.finished)).then(() => generation === this.generation && this.settle());

        this.scheduleSettle();
        this.tick();
    }

    unbindMotionListener() {
        this.tracking = false;
        this.animations = [];

        if (this.frame) {
            cancelAnimationFrame(this.frame);
            this.frame = null;
        }

        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    destroy() {
        this.unbindMotionListener();
        this.element = null;
        this.listener = null;
    }

    private getTargetAnimations(): Animation[] {
        const element = this.element as Element;

        if (!element || typeof element.getAnimations !== 'function') {
            return [];
        }

        const animations: Animation[] = [];

        for (let node: Element | null = element; node; node = getMotionParent(node)) {
            animations.push(...node.getAnimations().filter(isSettlingAnimation));
        }

        return animations;
    }

    private scheduleSettle() {
        const deadline = Math.max(...this.animations.map(getRemainingTime)) + MOTION_SETTLE_SLACK;

        this.timeout = setTimeout(() => {
            // An estimate, not a verdict: the rate can change and a paused animation can resume,
            // so an animation that is still running earns a fresh deadline instead of settling.
            if (this.animations.some((animation) => animation.playState === 'running')) {
                this.scheduleSettle();
            } else {
                this.settle();
            }
        }, deadline);
    }

    private tick() {
        this.frame = requestAnimationFrame(() => {
            if (!this.tracking) {
                return;
            }

            this.listener(false);

            // The listener may have unbound the handler - hiding the overlay it was aligning.
            this.tracking && this.tick();
        });
    }

    private settle() {
        if (!this.tracking) {
            return;
        }

        this.unbindMotionListener();
        this.listener(true);
    }
}
