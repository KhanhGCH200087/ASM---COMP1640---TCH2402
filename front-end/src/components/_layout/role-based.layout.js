import {PropsWithChildren, ReactNode} from "react"
import {Navigate} from "react-router-dom";

type Props = PropsWithChildren<{
    roles: string[],
    whenNotAllow?: ReactNode
}>

const RoleBasedLayout = ({roles, whenNotAllow, children}: Props) => {
    const localRole = localStorage.getItem("role");

    if (!localRole) {
        return <Navigate to={'/'}/>
    }

    const isAllow = roles.includes(localRole);

    if (!isAllow) {
        return <>{whenNotAllow}</>
    }

    return <>{children}</>
}

export default RoleBasedLayout