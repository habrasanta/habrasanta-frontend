import { AddressForm, AddressFormError, Mail, Participation, Season, User } from "../models";
import { deleteRequest, getRequest, postRequest } from "./utils";

export async function getLatestSeason(): Promise<Season> {
  return await getRequest("/api/v1/seasons/latest");
}

export async function getSeason(year: string): Promise<Season> {
  return await getRequest(`/api/v1/seasons/${year}`);
}

export async function getSeasonParticipation(year: string): Promise<Participation> {
  return await getRequest(`/api/v1/seasons/${year}/participation`);
}

export async function getSeasonSantaChat(year: string): Promise<Mail[]> {
  return await getRequest(`/api/v1/seasons/${year}/santa_chat`);
}

export async function getSeasonGifteeChat(year: string): Promise<Mail[]> {
  return await getRequest(`/api/v1/seasons/${year}/giftee_chat`);
}

export async function postSeasonParticipation(year: string, user: User, data: AddressForm): Promise<{ 
  season?: Season, participation?: Participation, errors?: AddressFormError }
> {
  return postRequest(`/api/v1/seasons/${year}/participation`, user, data);
}

export async function deleteSeasonParticipation(year: string, user: User): Promise<{ 
  season?: Season, participation?: Participation }
> {
  return deleteRequest(`/api/v1/seasons/${year}/participation`, user);
}

export function postSantaChat(year: string, user: User, data: { text: string }): Promise<{  mail: Mail }> {
  return postRequest(`/api/v1/seasons/${year}/santa_chat`, user, data);
}

export function postGifteeChat(year: string, user: User, data: { text: string }): Promise<{ mail: Mail }> {
  return postRequest(`/api/v1/seasons/${year}/giftee_chat`, user, data);
}

export async function postMarkShipped(year: string, user: User): Promise<{ 
  season: Season, participation: Participation }
> {
  return postRequest(`/api/v1/seasons/${year}/mark_shipped`, user);
}

export async function postMarkDelivered(year: string, user: User): Promise<{ 
  season: Season, participation: Participation }
> {
  return postRequest(`/api/v1/seasons/${year}/mark_delivered`, user);
}