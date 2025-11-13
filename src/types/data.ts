export enum VehicleType {
  NENHUM = "Nenhum",
  PEQUENO = "Carro Pequeno",
  GRANDE = "Carro Grande",
  MOTO = "Moto",
  VAN = "Van",
  CAMINHAO = "Caminhão",
}

// Mapeamento dos preços para cada tipo de veículo
export const VEHICLE_PRICES: Record<VehicleType, number> = {
  [VehicleType.NENHUM]: 0,
  [VehicleType.PEQUENO]: 50,
  [VehicleType.GRANDE]: 90,
  [VehicleType.MOTO]: 30,
  [VehicleType.VAN]: 130,
  [VehicleType.CAMINHAO]: 180,
};

// Preço das passagens por pessoa
export const PASSENGER_PRICES = {
  adult: 25,
  child: 12,
};
