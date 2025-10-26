

export type TableLabel = {
    display_name: string    // display name
    raw_name: string        // value for fetching
    renderType: 'text' | 'select' | 'link'
    values?: string[]       // exists if renderType === 'select'
}

/* TableLabel example:
    const labels: Label[] = [
        {
            display_name: "Status",
            raw_name: "status",
            static: false,
            values: ["PENDING", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"]
        },
        {
            display_name: "Company",
            raw_name: "job.company",
            static: true,
        },
    ]
    */