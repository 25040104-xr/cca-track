import { ccas } from "../data/ccas";

export function getAllCCAs() {
  return ccas;
}

export function getCCAById(id) {
  return ccas.find((cca) => cca.id === id);
}