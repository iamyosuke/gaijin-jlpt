"use client"

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useTranslations } from 'next-intl';
const CustomerPortalButton = () => {
    const { data: session } = useSession();
    const t = useTranslations('CustomerPortalButton');
    if (!session || !session.user ) {
        return null;
    }

    return (
      <Button variant="outline" asChild>
        <Link href={process.env.NEXT_PUBLIC_CUSTOMER_PORTAL_LINK as string + "?prefilled_email=" + session.user.email} target="_blank" rel="noopener noreferrer">
            {t('manage_subscription')}
        </Link>
      </Button>
    )
}

export default CustomerPortalButton;