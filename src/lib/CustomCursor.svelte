<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    let cursorElement: HTMLDivElement | undefined = $state();
    
    interface SpringConfig {
        damping?: number;
        stiffness?: number;
        precision?: number;
    }

    // Spring physics class
    class Spring {
        value: number;
        target: number;
        velocity: number;
        damping: number;
        stiffness: number;
        precision: number;

        constructor(initialValue = 0, config: SpringConfig = {}) {
            this.value = initialValue;
            this.target = initialValue;
            this.velocity = 0;
            this.damping = config.damping || 0.8;
            this.stiffness = config.stiffness || 0.15;
            this.precision = config.precision || 0.001;
        }

        set(newTarget: number) {
            this.target = newTarget;
        }

        update() {
            const delta = this.target - this.value;
            const spring = delta * this.stiffness;
            const damper = this.velocity * -this.damping;
            const acceleration = spring + damper;

            this.velocity += acceleration;
            this.value += this.velocity;

            if (Math.abs(this.velocity) < this.precision && Math.abs(delta) < this.precision) {
                this.value = this.target;
                this.velocity = 0;
            }

            return this.value;
        }
    }

    onMount(() => {
        if (!browser) return;

        const springConfig = {
            damping: 0.8,
            stiffness: 0.15,
            precision: 0.001
        };

        const cursorX = new Spring(0, springConfig);
        const cursorY = new Spring(0, springConfig);
        const rotation = new Spring(0, {
            damping: 0.9,
            stiffness: 0.1,
            precision: 0.01
        });
        const scale = new Spring(1, {
            damping: 0.7,
            stiffness: 0.2,
            precision: 0.001
        });

        let lastMousePos = { x: 0, y: 0 };
        let smoothedVelocity = { x: 0, y: 0 };
        let lastUpdateTime = Date.now();
        let previousAngle = 0;
        let accumulatedRotation = 0;
        let rafId = 0;
        let baseScale = 1;
        let isClicking = false;

        function updateVelocity(currentPos: {x: number, y: number}) {
            const currentTime = Date.now();
            const deltaTime = Math.min(currentTime - lastUpdateTime, 50);

            if (deltaTime > 0) {
                const rawVelocity = {
                    x: (currentPos.x - lastMousePos.x) / deltaTime,
                    y: (currentPos.y - lastMousePos.y) / deltaTime
                };

                const smoothingFactor = 0.3;
                smoothedVelocity = {
                    x: smoothedVelocity.x * (1 - smoothingFactor) + rawVelocity.x * smoothingFactor,
                    y: smoothedVelocity.y * (1 - smoothingFactor) + rawVelocity.y * smoothingFactor
                };
            }

            lastUpdateTime = currentTime;
            lastMousePos = currentPos;
        }

        function isInteractiveElement(element: Element | null): boolean {
            if (!element) return false;
            
            const tagName = element.tagName.toLowerCase();
            const interactiveTags = ['a', 'button', 'input', 'textarea', 'select', 'label'];
            
            if (interactiveTags.includes(tagName)) return true;
            
            // @ts-expect-error - element.onclick may not exist on all Element types
            if (element.onclick || 
                element.getAttribute('role') === 'button' || 
                element.getAttribute('role') === 'link' ||
                window.getComputedStyle(element).cursor === 'pointer') {
                return true;
            }
            
            return false;
        }

        function updateBaseScale(e: MouseEvent) {
            // Because our cursor has pointer-events: none, we can get the element underneath
            const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
            const isInteractive = isInteractiveElement(elementUnderCursor);
            
            baseScale = isInteractive ? 1.5 : 1;
        }

        function handleMouseMove(e: MouseEvent) {
            const currentPos = { x: e.clientX, y: e.clientY };
            updateVelocity(currentPos);
            updateBaseScale(e);

            const speed = Math.hypot(smoothedVelocity.x, smoothedVelocity.y);

            cursorX.set(currentPos.x);
            cursorY.set(currentPos.y);

            if (speed > 0.05) {
                const currentAngle = Math.atan2(smoothedVelocity.y, smoothedVelocity.x) * (180 / Math.PI) + 90;

                let angleDiff = currentAngle - previousAngle;

                while (angleDiff > 180) angleDiff -= 360;
                while (angleDiff < -180) angleDiff += 360;

                if (Math.abs(angleDiff) > 1) {
                    accumulatedRotation += angleDiff;
                    rotation.set(accumulatedRotation);
                    previousAngle = currentAngle;
                }

                if (!isClicking) {
                    const targetScale = baseScale * 0.97;
                    scale.set(targetScale);
                    setTimeout(() => {
                        if (!isClicking) scale.set(baseScale);
                    }, 200);
                }
            } else {
                if (!isClicking) {
                    scale.set(baseScale);
                }
            }
        }

        function throttledMouseMove(e: MouseEvent) {
            if (rafId) return;

            rafId = requestAnimationFrame(() => {
                handleMouseMove(e);
                rafId = 0;
            });
        }

        function handleMouseDown() {
            isClicking = true;
            scale.set(baseScale * 0.7);
        }

        function handleMouseUp() {
            isClicking = false;
            scale.set(baseScale);
        }

        let animationFrame: ReturnType<typeof requestAnimationFrame>;
        function animate() {
            if (!cursorElement) return;

            const x = cursorX.update();
            const y = cursorY.update();
            const rot = rotation.update();
            const scl = scale.update();

            cursorElement.style.transform = `
                translate(${x}px, ${y}px)
                translate(-50%, -50%)
                rotate(${rot}deg)
                scale(${scl})
            `;

            animationFrame = requestAnimationFrame(animate);
        }

        window.addEventListener('mousemove', throttledMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        animate();

        return () => {
            window.removeEventListener('mousemove', throttledMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            cancelAnimationFrame(animationFrame);
            if (rafId) cancelAnimationFrame(rafId);
        };
    });
</script>

<div 
    bind:this={cursorElement}
    style="
        position: fixed;
        left: 0;
        top: 0;
        z-index: 2147483647;
        pointer-events: none;
        will-change: transform;
    "
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="54"
        viewBox="0 0 50 54"
        fill="none"
        style="scale: 0.5; display: block;"
    >
        <g filter="url(#filter0_d_91_7928)">
            <path
                d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
                fill="black"
            />
            <path
                d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
                stroke="white"
                stroke-width="2.25825"
            />
        </g>
        <defs>
            <filter
                id="filter0_d_91_7928"
                x="0.602397"
                y="0.952444"
                width="49.0584"
                height="52.428"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dy="2.25825" />
                <feGaussianBlur stdDeviation="2.25825" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
                />
                <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_91_7928"
                />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_91_7928"
                    result="shape"
                />
            </filter>
        </defs>
    </svg>
</div>
