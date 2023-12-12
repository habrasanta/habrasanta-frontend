import { Country } from "../models";
import { getRequest } from "./utils";

export async function getCountries(): Promise<Country[]> {
  return await getRequest("/api/v1/countries");
}