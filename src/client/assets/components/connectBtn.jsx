import { Wallet, ExternalLink, Check } from "lucide-react";

export function ConnectBtn({wallet, handleClick}) {
    return (
        <button 
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background hover:text-accent-foreground h-9 rounded-md px-3 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10" 
            type="button">
            <svg className="w-2 h-2 sm:w-4 sm:h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.9 6 10 6.9 10 8V16C10 17.1 10.9 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" fill="currentColor">
                </path>
            </svg>
                {wallet ? `${wallet.slice(0, 5)}...${wallet.slice(-4)}` : "CONNECT WALLET"}
        </button>
    )
}