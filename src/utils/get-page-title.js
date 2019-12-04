import defaultSettings from '@/settings'
import { isNotBlank } from '@/utils/index'

const title = defaultSettings.title || 'project-manager'
const getPageTitle = (pageTitle) => {
  return isNotBlank(pageTitle) ? (pageTitle + ' - ' + title) : title
}

export default getPageTitle
