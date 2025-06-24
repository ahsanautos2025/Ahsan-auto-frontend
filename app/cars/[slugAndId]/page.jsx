import CarDetails from "./CarDetails";
export const dynamic = 'force-dynamic';

export default function CarDetailsPage({ params }) {
  return <CarDetails slugAndId={params.slugAndId} />;
}