import caller from './api-caller'
import URL from '../../constants/url'

export const changelogsLatest = () => {
  const url = `${URL.Skylab.apiURL()}/changelogs/latest`
  return caller.get(url, {}, true)
}

export const changelogsList = () => {
  const url = `${URL.Skylab.apiURL()}/changelogs`
  return caller.get(url, {}, true)
}
