import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

function Home() {

	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center min-h-svh gap-5">
			<Button onClick={() => navigate('/service/new/')}>
				New Service
			</Button>
			<Button onClick={() => navigate('/services/list/')} variant={'secondary'}>
				List Services
			</Button>
		</div>
	)
}

export default Home
