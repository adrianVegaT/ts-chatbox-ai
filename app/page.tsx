import Image from "next/image";
import ChatBox from "./_components/ChatBox";

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-2xl">
				<h1 className="text-2xl font-medium text-gray-800 mb-6">AI Chat</h1>
				<ChatBox />
			</div>
		</div>
	)
}