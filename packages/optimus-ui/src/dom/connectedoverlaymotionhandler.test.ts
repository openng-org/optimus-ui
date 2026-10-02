import { nextFrame } from '@openng/optimus-ui-utils';
import { ConnectedOverlayMotionHandler } from './connectedoverlaymotionhandler';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe('ConnectedOverlayMotionHandler', () => {
    let ancestor: HTMLElement;
    let target: HTMLElement;
    let handler: ConnectedOverlayMotionHandler | null;
    let calls: number;

    const createHandler = (element: HTMLElement = target) => {
        handler = new ConnectedOverlayMotionHandler(element, () => calls++);
        handler.bindMotionListener();

        return handler;
    };

    const animateAncestor = (options: KeyframeAnimationOptions = { duration: 500 }) => ancestor.animate([{ transform: 'translateY(0px)' }, { transform: 'translateY(100px)' }], options);

    beforeEach(() => {
        calls = 0;
        handler = null;
        ancestor = document.createElement('div');
        target = document.createElement('button');
        ancestor.appendChild(target);
        document.body.appendChild(ancestor);
    });

    afterEach(() => {
        handler?.destroy();
        ancestor.getAnimations().forEach((animation) => animation.cancel());
        ancestor.remove();
    });

    it('should not call the listener when nothing around the element animates', async () => {
        createHandler();

        await nextFrame();

        expect(calls).toBe(0);
    });

    it('should call the listener on every frame while an ancestor animates', async () => {
        animateAncestor();
        createHandler();

        await nextFrame();

        expect(calls).toBeGreaterThan(0);
    });

    it('should call the listener while the element itself animates', async () => {
        target.animate([{ transform: 'scale(1)' }, { transform: 'scale(2)' }], { duration: 500 });
        createHandler();

        await nextFrame();

        expect(calls).toBeGreaterThan(0);
    });

    it('should ignore animations of descendants', async () => {
        const descendant = document.createElement('span');
        target.appendChild(descendant);
        descendant.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500 });
        createHandler();

        await nextFrame();

        expect(calls).toBe(0);
    });

    it('should ignore animations that never end', async () => {
        animateAncestor({ duration: 500, iterations: Infinity });
        createHandler();

        await nextFrame();

        expect(calls).toBe(0);
    });

    it('should stop calling the listener once the animation is over', async () => {
        const animation = animateAncestor();
        createHandler();

        await nextFrame();
        animation.finish();
        await nextFrame();

        const settled = calls;
        await nextFrame();

        expect(settled).toBeGreaterThan(0);
        expect(calls).toBe(settled);
    });

    it('should call the listener a last time on the settled position', async () => {
        const positions: number[] = [];

        const animation = animateAncestor({ duration: 500, fill: 'forwards' });
        handler = new ConnectedOverlayMotionHandler(target, () => positions.push(target.getBoundingClientRect().top));
        handler.bindMotionListener();

        await nextFrame();
        animation.finish();
        await nextFrame();

        expect(positions.at(-1)).toBe(target.getBoundingClientRect().top);
    });

    it('should stop calling the listener when the animation stalls', async () => {
        const animation = animateAncestor({ duration: 50 });
        animation.pause();
        createHandler();

        await wait(300);
        const stalled = calls;
        await nextFrame();

        expect(stalled).toBeGreaterThan(0);
        expect(calls).toBe(stalled);
    });

    it('should not call the listener after destroy', async () => {
        animateAncestor();
        createHandler();

        await nextFrame();
        handler?.destroy();
        const destroyed = calls;
        await nextFrame();

        expect(calls).toBe(destroyed);
    });

    it('should keep tracking when an earlier animation ends after a rebind', async () => {
        animateAncestor({ duration: 120 });
        createHandler();
        animateAncestor({ duration: 900 });
        handler!.bindMotionListener();

        await wait(300);
        const afterShortAnimation = calls;
        await nextFrame();

        expect(calls).toBeGreaterThan(afterShortAnimation);
    });

    it('should not settle early when the animation plays at a reduced rate', async () => {
        const animation = animateAncestor({ duration: 200 });
        animation.playbackRate = 0.25;
        createHandler();

        await wait(500);
        const afterUnscaledEnd = calls;
        await nextFrame();

        expect(calls).toBeGreaterThan(afterUnscaledEnd);
    });

    it('should follow a class driven CSS animation', async () => {
        const style = document.createElement('style');

        style.textContent = `
            @keyframes motion-handler-slide { from { transform: translateY(0px); } to { transform: translateY(60px); } }
            .motion-handler-sliding { animation: motion-handler-slide 400ms linear; }
        `;
        document.head.appendChild(style);
        ancestor.classList.add('motion-handler-sliding');
        createHandler();

        await nextFrame();
        style.remove();

        expect(calls).toBeGreaterThan(0);
    });

    it('should cross a shadow root to reach an animating host', async () => {
        const host = document.createElement('div');

        document.body.appendChild(host);
        const shadowTarget = document.createElement('button');
        host.attachShadow({ mode: 'open' }).appendChild(shadowTarget);
        host.animate([{ transform: 'translateY(0px)' }, { transform: 'translateY(100px)' }], { duration: 500 });

        handler = new ConnectedOverlayMotionHandler(shadowTarget, () => calls++);
        handler.bindMotionListener();

        await nextFrame();
        host.remove();

        expect(calls).toBeGreaterThan(0);
    });

    it('should stop when the listener unbinds the handler', async () => {
        animateAncestor();
        handler = new ConnectedOverlayMotionHandler(target, () => {
            calls++;
            handler?.unbindMotionListener();
        });
        handler.bindMotionListener();

        await nextFrame();
        await nextFrame();

        expect(calls).toBe(1);
    });

    it('should not call the listener after unbind', async () => {
        animateAncestor();
        createHandler();

        await nextFrame();
        handler?.unbindMotionListener();
        const unbound = calls;
        await nextFrame();

        expect(calls).toBe(unbound);
    });
});
