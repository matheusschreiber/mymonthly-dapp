export function Footer() {

    return (
        <footer className="flex items-center justify-center my-16 gap-2 text-zinc-700">
            <a href="https://github.com/matheusschreiber/dapp-proj-final.git" target="_blank" rel="noreferrer"
                className="flex items-center gap-2">
                <img src="/github.png" alt="Github icon" width={20}/>
                Repo
            </a>|
            <p>Matheus Schreiber — 2025</p>
        </footer >
    )
}