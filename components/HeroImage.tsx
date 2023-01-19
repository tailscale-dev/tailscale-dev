export function HeroImage({ name, prompt }: { name: string, prompt: string }) {
    return (
        <picture style="margin:0">
            <source type="image/avif" srcset=`/images/hero/${name}.avif` />
            <source type="image/webp" srcset=`/images/hero/${name}.webp` />
            <img class="hero" loading="lazy" alt=`an image of ${prompt}` src=`/images/hero/${name}.png` />
        </picture>
    );
}
