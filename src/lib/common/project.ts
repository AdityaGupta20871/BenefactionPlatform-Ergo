import { type Platform } from "./platform";

export interface Project {
    platform: Platform,
    box: any,
    token_id: string,
    block_limit: number,
    minimum_amount: number,
    amount_sold: number,
    value: number,
    total_amount: number,
    exchange_rate: number, 
    link: string,
    owner: string
}

export async function is_ended(project: Project): Promise<boolean> {
    let height = await project.platform.get_current_height();

    return project.block_limit < height
}

export async function min_raised(project: Project): Promise<boolean> {
    return project.amount_sold > project.minimum_amount
}