import { BadRequestError } from '../errors'

export class Container {
    private providers: Record<string, any> = {}
    private static instance: Container
    private constructor() {}

    public static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container()
        }

        return Container.instance
    }

    public register(token: string, target: any): void {
        this.providers[token] = new target()
    }

    public resolve(token: string) {
        //find provider correspond to token
        const matchedProvider = this.providers[token]

        if (!matchedProvider) {
            throw new BadRequestError(`No provider found for ${token}`)
        }
        console.log('Container: ', token, this.providers)
        return matchedProvider
    }
}
