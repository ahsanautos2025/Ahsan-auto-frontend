import CarDetails from "./CarDetails";

export default function CarDetailsPage({ params }) {
  return <CarDetails slugAndId={params.slugAndId} />;
}