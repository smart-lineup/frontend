import { CreditCardIcon } from "lucide-react"

type CardShapeProps = {
    cardLastNumber: string;
    username: string;
};

const CardShape: React.FC<CardShapeProps> = ({ cardLastNumber, username }) => {
    return (
        <div className="mx-auto mb-6 max-w-[280px]">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 shadow-md text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mt-6 -mr-6"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -mb-4 -ml-4"></div>

                <div className="flex justify-between items-center mb-4">
                    <div className="text-xs font-light opacity-80">등록된 카드</div>
                    <div className="flex items-center">
                        <CreditCardIcon className="h-5 w-5 mr-1" />
                    </div>
                </div>

                <div className="mb-6 flex items-center">
                    <div className="mr-2 w-8 h-5 bg-white/20 rounded"></div>
                    <div className="mr-2 w-8 h-5 bg-white/20 rounded"></div>
                    <div className="mr-2 w-8 h-5 bg-white/20 rounded"></div>
                    <div className="font-mono text-lg">{cardLastNumber}</div>
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-xs opacity-70">카드 결제자</div>
                        <div className="font-medium">{username || "사용자"}</div>
                    </div>
                    <div className="opacity-80">
                        <svg width="40" height="12" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M17.9 0H3.1C1.4 0 0 1.4 0 3.1V11.9C0 13.6 1.4 15 3.1 15H17.9C19.6 15 21 13.6 21 11.9V3.1C21 1.4 19.6 0 17.9 0Z"
                                fill="white"
                            />
                            <path
                                d="M17.9 0H3.1C1.4 0 0 1.4 0 3.1V11.9C0 13.6 1.4 15 3.1 15H17.9C19.6 15 21 13.6 21 11.9V3.1C21 1.4 19.6 0 17.9 0Z"
                                fill="white"
                            />
                            <path d="M8.3 12.9H12.7V2.1H8.3V12.9Z" fill="#FF5F00" />
                            <path
                                d="M8.7 7.5C8.7 5.3 9.8 3.3 11.5 2.1C10.4 1.2 9 0.7 7.5 0.7C3.9 0.7 1 3.7 1 7.5C1 11.3 3.9 14.3 7.5 14.3C9 14.3 10.4 13.8 11.5 12.9C9.8 11.7 8.7 9.7 8.7 7.5Z"
                                fill="#EB001B"
                            />
                            <path
                                d="M20 7.5C20 11.3 17.1 14.3 13.5 14.3C12 14.3 10.6 13.8 9.5 12.9C11.2 11.7 12.3 9.7 12.3 7.5C12.3 5.3 11.2 3.3 9.5 2.1C10.6 1.2 12 0.7 13.5 0.7C17.1 0.7 20 3.7 20 7.5Z"
                                fill="#F79E1B"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardShape;