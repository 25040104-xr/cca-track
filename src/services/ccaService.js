import { ccas } from "../data/ccas";

export function getAllCCAs() {
  return Promise.resolve(ccas);
}

export function getCCAById(id) {
  return Promise.resolve(ccas.find((cca) => cca.id === id));
}

