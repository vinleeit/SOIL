import SoilButton from "./SoilButton";
import SoilLogo from "../components/SoilLogo"


export default function SoilHeader() {
    return (
        <header>
            <div className="h-16">
                <nav className="flex h-full items-center justify-between px-8 border-b-2 border-lime-500">
                    <SoilLogo />
                    <ul className="flex space-x-2">
                        <li>
                            <SoilButton outlined>
                                Special Deals
                            </SoilButton>
                        </li>
                        <li>
                            <SoilButton>
                                Login
                            </SoilButton>
                        </li>
                    </ul>
                </nav>
            </div>
            <span className="h-8 bg-lime-400 flex items-center justify-center text-sm">
                Fresh and Organic Foods for Australians!
            </span>
        </header>
    )
}