/**
 * Real proof only. Every array starts empty: do not add entries until the
 * workshop supplies the source material. The conditional section on the
 * workshop page stays hidden while these are empty.
 */

export type Review = {
  id: string;
  author: string;
  date: string;
  rating?: number;
  text: string;
  source?: string;
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  expires?: string;
  detail?: string;
};

export type WorkshopEvidence = {
  id: string;
  title: string;
  detail: string;
  image?: string;
  imageAlt?: string;
};

export const reviews: Review[] = [];
export const certifications: Certification[] = [];
export const workshopEvidence: WorkshopEvidence[] = [];

export function hasProof(): boolean {
  return reviews.length > 0 || certifications.length > 0 || workshopEvidence.length > 0;
}
