import { createFileRoute } from '@tanstack/react-router'
import { RoomPage } from '../components/RoomPage'

export const Route = createFileRoute('/room/$slug')({
  component: () => {
    const { slug } = Route.useParams()
    return <RoomPage slug={slug} />
  },
})
