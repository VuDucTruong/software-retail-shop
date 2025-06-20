import React, {ReactNode} from 'react'
import {Card, CardContent} from "@/components/ui/card";
import {AlertTriangle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {LoadingStatus} from "@/api";
import ReactMarkdown from "react-markdown";


export default function LoadingPage() {
    return (
        <div className='flex flex-col justify-center items-center gap-2 h-full'>
            <div className="animate-spin rounded-full h-28 w-28 border-b-3 border-blue-500"></div>
            <h1 className='text-xl font-bold'>Đang tải...</h1>
            <p className='text-gray-500'>Vui lòng chờ trong khi đang tải trang</p>
        </div>
    )
}

export function ErrorPage({errorMessage, onRetry}: { errorMessage?: string | null, onRetry?: () => void }) {

    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <Card className="w-full max-w-md shadow-xl border border-red-300 bg-red-50">
                <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
                    <div className="bg-red-100 p-4 rounded-full shadow-md">
                        <AlertTriangle className="text-red-500 h-10 w-10"/>
                    </div>
                    <h2 className="text-xl font-semibold text-red-700 text-center">
                        Đã xảy ra lỗi khi tải nội dung
                    </h2>
                    <p className="text-sm text-center text-red-600">
                        {errorMessage ?? `Có thể do kết nối mạng hoặc lỗi hệ thống. Vui lòng thử lại sau.`}
                    </p>
                    {
                        onRetry &&
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={onRetry}
                        >
                            Thử lại
                        </Button>
                    }
                </CardContent>
            </Card>
        </div>
    )
}

type StatusDependentType = {
    status: LoadingStatus,
    error: string | null | undefined,
    children: ReactNode,
    altLoading?: ReactNode | null
    altError?: ReactNode | null
}

export function StatusDependentRenderer({status, error, children, altLoading, altError}
                                        : StatusDependentType): ReactNode {
    if (status === 'loading') {
        if (altLoading)
            return <>{altLoading}</>
        return <LoadingPage/>
    } else if (status === 'error') {
        if (altError)
            return <>{altError}</>
        return <ErrorPage errorMessage={error}/>
    }
    return (
        <>
            {children}
        </>
    )
}

// export function SkeletonAlternateRenderer({status, error, children, alternate}:
//                                               StatusDependentType & AlternateChildren): ReactNode {
//     if (status === 'loading') {
//         return <>{alternate}</>
//     }
//     if (status === 'error')
//         return <ErrorPage errorMessage={error}/>
//     return (
//         <>{children}</>
//     )
// }