import type { SvgIconComponent } from '@mui/icons-material'
import BoltOutlined from '@mui/icons-material/BoltOutlined'
import BusinessOutlined from '@mui/icons-material/BusinessOutlined'
import PrecisionManufacturingOutlined from '@mui/icons-material/PrecisionManufacturingOutlined'
import FactoryOutlined from '@mui/icons-material/FactoryOutlined'
import LocalFloristOutlined from '@mui/icons-material/LocalFloristOutlined'
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined'
import LandscapeOutlined from '@mui/icons-material/LandscapeOutlined'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined'
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined'
import TrainOutlined from '@mui/icons-material/TrainOutlined'
import LocalParkingOutlined from '@mui/icons-material/LocalParkingOutlined'
import DirectionsTransitOutlined from '@mui/icons-material/DirectionsTransitOutlined'
import FlightTakeoffOutlined from '@mui/icons-material/FlightTakeoffOutlined'
import WaterDropOutlined from '@mui/icons-material/WaterDropOutlined'
import PlumbingOutlined from '@mui/icons-material/PlumbingOutlined'
import HubOutlined from '@mui/icons-material/HubOutlined'
import GrassOutlined from '@mui/icons-material/GrassOutlined'
import WaterOutlined from '@mui/icons-material/WaterOutlined'
import TerrainOutlined from '@mui/icons-material/TerrainOutlined'
import SubwayOutlined from '@mui/icons-material/SubwayOutlined'
import RouteOutlined from '@mui/icons-material/RouteOutlined'
import EngineeringOutlined from '@mui/icons-material/EngineeringOutlined'
import ElevatorOutlined from '@mui/icons-material/ElevatorOutlined'

export interface ServiceItem {
  id: string
  label: string
  icon: SvgIconComponent
}

/** For store: id, label, iconId (key into iconRegistry). */
export interface ServiceItemRecord {
  id: string
  label: string
  iconId: string
}

/** Map icon id to MUI icon component (for dropdown + rendering). */
export const iconRegistry: Record<string, SvgIconComponent> = {
  irrigation: GrassOutlined,
  transmission: BoltOutlined,
  'ohd-substation': BusinessOutlined,
  industrial: PrecisionManufacturingOutlined,
  factories: FactoryOutlined,
  'power-plants': LocalFloristOutlined,
  facilities: Inventory2Outlined,
  mining: LandscapeOutlined,
  residential: HomeOutlined,
  commercial: StorefrontOutlined,
  institutional: AccountBalanceOutlined,
  'railway-stations': TrainOutlined,
  'car-parks': LocalParkingOutlined,
  'transit-terminals': DirectionsTransitOutlined,
  airports: FlightTakeoffOutlined,
  'intake-treatment': WaterDropOutlined,
  pipeline: PlumbingOutlined,
  'storage-distribution': HubOutlined,
  'hydro-power': WaterOutlined,
  railways: TerrainOutlined,
  metro: SubwayOutlined,
  highways: RouteOutlined,
  tunnels: EngineeringOutlined,
  elevated: ElevatorOutlined,
}

const initialRows: ServiceItemRecord[] = [
  { id: 'irrigation', label: 'Irrigation', iconId: 'irrigation' },
  { id: 'residential', label: 'Residential', iconId: 'residential' },
  { id: 'hydro-power', label: 'Hydro Power Projects', iconId: 'hydro-power' },
  { id: 'power-plants', label: 'Power Plants', iconId: 'power-plants' },
  { id: 'railways', label: 'Railways (including Tunnels)', iconId: 'railways' },
  { id: 'transmission', label: 'Transmission & Distribution lines', iconId: 'transmission' },
  { id: 'ohd-substation', label: 'OHD Sub station', iconId: 'ohd-substation' },
  { id: 'industrial', label: 'Industrial Plans', iconId: 'industrial' },
  { id: 'factories', label: 'Factories', iconId: 'factories' },
  { id: 'facilities', label: 'Facilities', iconId: 'facilities' },
  { id: 'mining', label: 'Open Cast & Underground Mining', iconId: 'mining' },
  { id: 'commercial', label: 'Commercial', iconId: 'commercial' },
  { id: 'institutional', label: 'Institutional', iconId: 'institutional' },
  { id: 'railway-stations', label: 'Railway Stations', iconId: 'railway-stations' },
  { id: 'car-parks', label: 'Multi-Level Car Parks', iconId: 'car-parks' },
  { id: 'transit-terminals', label: 'Transit Terminals', iconId: 'transit-terminals' },
  { id: 'airports', label: 'Airports', iconId: 'airports' },
  { id: 'intake-treatment', label: 'Intake & Treatment', iconId: 'intake-treatment' },
  { id: 'pipeline', label: 'Pipeline Distribution', iconId: 'pipeline' },
  { id: 'storage-distribution', label: 'Storage & Distribution', iconId: 'storage-distribution' },
  { id: 'metro', label: 'Metro Rails', iconId: 'metro' },
  { id: 'highways', label: 'Highways', iconId: 'highways' },
  { id: 'tunnels', label: 'Tunnels', iconId: 'tunnels' },
  { id: 'elevated', label: 'Elevated Corridors', iconId: 'elevated' },
]

/** Options for icon dropdown in Add Service form (id + display label). */
export const iconOptions = Object.entries(iconRegistry).map(([id]) => ({
  value: id,
  label: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
}))

export const initialServicesList = initialRows
