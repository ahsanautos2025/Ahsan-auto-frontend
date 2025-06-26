import CarDetails from "./CarDetails";
export const dynamic = 'force-dynamic';

export default async function CarDetailsPage(props) {
  const { params } = await props;
  return <CarDetails slugAndId={params.slugAndId} />;
}
