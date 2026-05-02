import { RiGithubFill, RiStarSFill } from "@remixicon/react";

export async function GithubStars() {
    let stars: number | null = null;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

        const res = await fetch('https://api.github.com/repos/ezet-galaxy/titanpl', {
            next: { revalidate: 3600 },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.ok) {
            const data = await res.json();
            stars = data.stargazers_count;
        }
    } catch (error) {
        // Silently fail or log as warning to prevent crashing the dev server UI
        console.warn('GitHub Stats Sync: Destination Unreachable (Offline or DNS issue).');
    }

    return (
        <div
            className="group w-fit my-0.5 flex items-center gap-2 hover:rounded-lg rounded-full border border-black/5 bg-zinc-500/5 px-3 py-1.5 text-xs font-medium text-zinc-800 backdrop-blur-md transition-all hover:bg-zinc-500/10 hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
        >
            <div className="flex items-center gap-1.5">
                <RiGithubFill className="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100" />
                <span>titanpl</span>
            </div>

            {stars != null && (
                <>
                    <div className="h-3 w-px bg-black/10 dark:bg-white/10" />
                    <div className="flex items-center gap-1 text-zinc-600 transition-colors group-hover:text-amber-500 dark:text-zinc-400 dark:group-hover:text-amber-400">
                        <RiStarSFill className="h-3.5 w-3.5" />
                        <span className="mt-0.5">{stars.toLocaleString()}</span>
                    </div>
                </>
            )}
        </div>
    );
}
