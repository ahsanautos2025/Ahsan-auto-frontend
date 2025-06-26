export default function getSlug(car : any) {
  return `${car.name}-${car.year}-${car._id}`.toLowerCase().replace(/\s+/g, "-")
}