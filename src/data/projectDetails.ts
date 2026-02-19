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
  contractValue: string
  contractor: string
  date: string
  totalCca: string
  workScope: string
  paymentTerms: string[]
  majorComponents: MajorComponent[]
}

const detailsStore: Record<string, ProjectDetailsData> = {
  'irrigation-kayampur-sitamau': {
    id: 'kayampur-sitamau',
    name: 'KAYAMPUR SITAMAU PRESSURIZED MICRO LIFT MAJOR IRRIGATION PROJECT',
    stateCode: 'MP',
    title: 'Kayampur Sitamau PILMI – Project Summary',
    client: 'Water Resources Department',
    workOrderNo: 'EI557WOD0000035',
    contractValue: '1,66,16,16,928.88',
    contractor: 'VENSAR MP JV',
    date: '15 Jan 2025',
    totalCca: '11,2124.00 HA',
    workScope: `Design, supply, erection, testing and commissioning of distribution management and filtration systems including control management, air management system and automation (PLC, sensors). Scope covers primary and secondary filtration works, pumping station, BPT, OMS, AMS, remote management system, central control room and LORA gateway.`,
    paymentTerms: [
      '5% after detailed design approval',
      '70% after receipt of material at site',
      '20% after erection and commissioning',
      '5% after clearance of final punch list',
    ],
    majorComponents: [
      { srNo: 1, component: 'Pumping Station', qty: 2 },
      { srNo: 2, component: 'BPT', qty: 3 },
      { srNo: 3, component: 'Outlet Management System (OMS)', qty: 3841 },
      { srNo: 4, component: 'Air Management System (AMS)', qty: 399 },
      { srNo: 5, component: 'Remote Management System (RMS)', qty: 399 },
      { srNo: 6, component: 'Filtration Works', qty: 39 },
      { srNo: 7, component: 'Central Control Room', qty: 1 },
      { srNo: 8, component: 'LORA Gateway', qty: 12 },
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
    contractValue: '—',
    contractor: '—',
    date: '—',
    totalCca: '—',
    workScope: 'Details will be updated from backend.',
    paymentTerms: [],
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
