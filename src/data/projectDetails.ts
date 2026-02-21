/**
 * Project details for Project Details screen. Backend se aane par replace karo.
 */
export interface MajorComponent {
  srNo: number
  component: string
  qty: number
}

export interface ProjectDetailsData {
  id: string
  name: string
  stateCode: string
  title: string
  client: string
  workOrderNo: string
  totalFlowRate: string
  contractor: string
  totalCca: string
  workScope: string
  majorComponents: MajorComponent[]
}

const detailsStore: Record<string, ProjectDetailsData> = {
  'irrigation-kayampur-sitamau': {
    id: 'kayampur-sitamau',
    name: 'KAYAMPUR SITAMAU PRESSURIZED MICRO LIFT MAJOR IRRIGATION PROJECT',
    stateCode: 'MP',
    title: 'Kayampur Sitamau PILMI – Project Summary',
    client: 'Water Resources Department (MP)',
    workOrderNo: 'EI557WOD0000035',
    totalFlowRate: '133203.31',
    contractor: 'VENSAR MP JV',
    totalCca: '1,12,124.00 HA',
    workScope: `Design, supply, erection, testing and commissioning of distribution management and pump house automation (PLC & SCADA, instruments) including the filtration systems and control management. Scope covers pumping station, DC, primary filtration, OMS, RMS, LORA gateway and master central control room.`,
    majorComponents: [
      { srNo: 1, component: 'Number of Pumping Station', qty: 2 },
      { srNo: 2, component: 'Delivery Chamber (DC)', qty: 1 },
      { srNo: 3, component: 'Outlet Management System (OMS)', qty: 3841 },
      { srNo: 5, component: 'Remote Management System (RMS)', qty: 399 },
      { srNo: 6, component: 'Primary Filtration Unit', qty: 33 },
      { srNo: 7, component: 'Master Central Control Room', qty: 1 },
      { srNo: 8, component: 'LORA Gateway', qty: 45 },
    ],
  },
}

function defaultDetails(projectId: string, name: string, stateCode: string): ProjectDetailsData {
  return {
    id: projectId,
    name,
    stateCode,
    title: `${name} Project Summary`,
    client: '—',
    workOrderNo: '—',
    totalFlowRate: '—',
    contractor: '—',
    totalCca: '—',
    workScope: 'Details will be updated from backend.',
    majorComponents: [],
  }
}

export function getProjectDetails(
  serviceId: string,
  projectId: string,
  fallbackName?: string,
  fallbackStateCode?: string
): ProjectDetailsData | null {
  const key = `${serviceId}-${projectId}`
  const stored = detailsStore[key]
  if (stored) return stored
  if (fallbackName != null && fallbackStateCode != null) {
    return defaultDetails(projectId, fallbackName, fallbackStateCode)
  }
  return null
}
