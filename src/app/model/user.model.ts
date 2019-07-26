
export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  token: string;
  name: string;
  last_name: string;
  box_id: number;
  team_id: number;
  troop_id: number;
  transport_id: number;
  plate: string;
  is_active: boolean;
  journeys_by_order: boolean;
  gps: boolean;
  can_converse: boolean;
  can_add_journeys: boolean;
  can_add_shipments: boolean;
  last_login_imei: boolean;
  current_login_imei: boolean;
  can_reorganize: boolean;
  color: string;
  phone: string;
  image: string;
}
