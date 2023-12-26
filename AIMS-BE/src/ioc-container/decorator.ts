import { Container } from './container'

export function Injectable(token: string): Function {
    return function (target: any): void {
        console.log('Injectable: ', token, target)
        Container.getInstance().register(token, target)
    }
}

export function Inject(token: string) {
    return function (target: any, key: string) {
        Object.defineProperty(target, key, {
            // replace default getter with resolve
            get: () => Container.getInstance().resolve(token),
            enumerable: true,
            configurable: true,
        })
        console.log(`Inject ${key} to ${target.constructor.name}`, target)
    }
}
