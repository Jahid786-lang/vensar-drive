/**
 * Service-wise projects. Backend se aane par is structure ko replace karo.
 * shortName = list/card par dikhane ke liye; name = details screen par full name.
 */
export interface ServiceProject {
  id: string
  /** Full name – details screen par use hota hai */
  name: string
  /** Card/list par dikhane ke liye short name (optional; nahi hai to name use karo) */
  shortName?: string
  stateCode: string
}

/** serviceId → projects. Mock – backend ready hone par API se replace. */
const projectsByService: Record<string, ServiceProject[]> = {
  irrigation: [
    {
      id: 'kayampur-sitamau',
      shortName: 'Kayampur Sitamau PILMI',
      name: 'KAYAMPUR SITAMAU PRESSURIZED MICRO LIFT MAJOR IRRIGATION PROJECT',
      stateCode: 'MP',
    },
    {
      id: 'maa-rewa',
      shortName: 'Maa Rewa LIR',
      name: 'MAA REWA LIFT IRRIGATION PROJECT',
      stateCode: 'MP',
    },
    {
      id: 'chentikheda',
      shortName: 'Chentikheda PILMI',
      name: 'CHENTIKHEDA PRESSURIZED MICRO LIFT MAJOR IRRIGATION PROJECT',
      stateCode: 'MP',
    },
    {
      id: 'sitapur-hanumana',
      shortName: 'Sitapur-Hanumana MIP',
      name: 'SITAPUR-HANUMANA MICRO IRRIGATION PROJECT',
      stateCode: 'MP',
    },
  ],
  transmission: [
    { id: 'bhopal-mp', name: 'Bhopal Grid', stateCode: 'MP' },
    { id: 'indore-mp', name: 'Indore Transmission', stateCode: 'MP' },
  ],
  'hydro-power': [
    { id: 'narmada-mp', name: 'Narmada Hydro', stateCode: 'MP' },
    { id: 'koyna-mh', name: 'Koyna', stateCode: 'MH' },
  ],
  railways: [
    { id: 'bina-mp', name: 'Bina Junction', stateCode: 'MP' },
    { id: 'mumbai-mh', name: 'Mumbai Central', stateCode: 'MH' },
  ],
  highways: [
    { id: 'nh44-mp', name: 'NH-44 MP Stretch', stateCode: 'MP' },
    { id: 'mumbai-pune-mh', name: 'Mumbai-Pune Expressway', stateCode: 'MH' },
  ],
  metro: [
    { id: 'bhopal-metro-mp', name: 'Bhopal Metro', stateCode: 'MP' },
    { id: 'nagpur-metro-mh', name: 'Nagpur Metro', stateCode: 'MH' },
  ],
  airports: [
    { id: 'bhopal-airport-mp', name: 'Bhopal Airport', stateCode: 'MP' },
    { id: 'nagpur-airport-mh', name: 'Nagpur Airport', stateCode: 'MH' },
  ],
  residential: [
    { id: 'green-valley-mp', name: 'Green Valley', stateCode: 'MP' },
    { id: 'pune-residential-mh', name: 'Pune Township', stateCode: 'MH' },
  ],
  commercial: [
    { id: 'indore-mall-mp', name: 'Indore Mall', stateCode: 'MP' },
    { id: 'mumbai-commercial-mh', name: 'Mumbai Commercial', stateCode: 'MH' },
  ],
  tunnels: [
    { id: 'narmada-tunnel-mp', name: 'Narmada Tunnel', stateCode: 'MP' },
    { id: 'mumbai-tunnel-mh', name: 'Mumbai Coastal Tunnel', stateCode: 'MH' },
  ],
}

export function getProjectsByServiceId(serviceId: string): ServiceProject[] {
  return projectsByService[serviceId] ?? []
}

/** Card/list par dikhane ke liye: shortName agar hai warna name */
export function getProjectDisplayName(project: ServiceProject): string {
  return project.shortName ?? project.name
}

/** Full name – details screen ke liye */
export function getProjectFullName(project: ServiceProject): string {
  return project.name
}

/** Display label: "Kayampur Sitamau PILMI MP" (list) ya "Name MP" */
export function formatProjectLabel(project: ServiceProject): string {
  return `${getProjectDisplayName(project)} ${project.stateCode}`
}
