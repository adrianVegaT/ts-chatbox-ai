import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Image from "next/image";
import ChatBox from "./_components/ChatBox"
import { getTokensUsed } from './_actions/chat'


export default async function Home() {
	const supabase = await createClient()
	const { data: { user } } = await supabase.auth.getUser()

	if (!user) {
		redirect('/auth/login')
	}

	const { data: history } = await supabase
		.from('messages')
		.select('*')
		.order('created_at', { ascending: true })

	const tokensUsed = await getTokensUsed()

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-2xl">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-medium text-gray-800">AI Chat</h1>
					<form action="/auth/logout" method="POST">
						<button
							type="submit"
							className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
						>
							Sign out
						</button>
					</form>
				</div>
				<ChatBox
                    history={history ?? []}
                    userId={user.id}
                    initialTokensUsed={tokensUsed}
                />
			</div>
		</div>
	)
}