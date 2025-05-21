import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { BreadType, RouteType } from '@/types'

import React from 'react'
import { Link, useLocation, useMatches } from 'react-router-dom'
type BreadProps = {
  breadcrumb?: Record<string, string>
}
interface Match {
  pathname: string
  handle: RouteType
  params: Record<string, string>
}
const Breadscrumb: React.FC<BreadProps> = (props) => {
  const { breadcrumb } = props
  const match = useMatches()
  const location = useLocation()
  const copyMatch = match.filter((x) => x.handle) as Match[]
  let breadArr: BreadType[] = []
  copyMatch.forEach((e) => {
    if (typeof e.handle.breadcrumb === 'function') {
      breadArr = breadArr.concat(e.handle.breadcrumb(e, breadcrumb))
    } else {
      breadArr.push({ name: e.handle.breadcrumb, pathname: e.pathname })
    }
  })
  console.log(breadArr)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadArr.map((e, index) => {
          return index === breadArr.length - 1 ? (
            <BreadcrumbItem key={index}>
              <BreadcrumbPage className={`${e.pathname === location.pathname ? 'text-green-400' : ''}`}>
                {e.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <>
              <Link to={e.pathname}>
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink className='hover:text-green-400'>{e.name}</BreadcrumbLink>
                </BreadcrumbItem>
              </Link>
              <BreadcrumbSeparator />
            </>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default Breadscrumb
