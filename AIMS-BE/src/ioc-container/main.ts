import { Container } from './container'
import { Inject, Injectable } from './decorator'
// tsc src//ioc-container//main.ts --target ES5 --emitDecoratorMetadata --experimentalDecorators
// node src//ioc-container//main.js

@Injectable('testService')
class TestService {
    public log(msg: string): void {
        console.log(msg)
    }
}

@Injectable('myService')
class MyService {
    public log(msg: string): void {
        console.log(msg)
    }
}

@Injectable('consumer')
class Consumer {
    private attr: string = 'attr'
    @Inject('testService') private testService?: TestService
    @Inject('myService') private myService?: MyService

    public constructor() {}

    public print(): void {
        this.testService?.log('Log Test Service')
        this.myService?.log('Log My Service')
    }

    public test(): void {}
}

const consumer: Consumer = Container.getInstance().resolve('consumer')
consumer.print()
