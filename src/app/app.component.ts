import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {
  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount);

  interval$ = interval(1000);
  intervalSignal = toSignal(this.interval$, { initialValue: 0 });

  customInterval$ = new Observable((subscriber) => {
    let timesExucuted = 0;
    const interval = setInterval(()=>{
      // subscriber.error();
      if (timesExucuted > 3){
        clearInterval(interval);
        subscriber.complete();
        return;
      }
      console.log('emitting new value ...');
      subscriber.next({message: 'New Value'});
      timesExucuted++;
    }, 2000);
  });

  private destroyRef = inject(DestroyRef);

  constructor(){
    effect(() => {
      console.log(`Clicked button ${this.clickCount()} times.`)
    })
  }
  
  ngOnInit(){
    // const subscription = interval(1000).pipe(
    //   map((val) => val*2)
    // ).subscribe({
    //   next: (val) => console.log(val),
    // });
    
    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe();
    // })
    this.customInterval$.subscribe({
      next: (val) => console.log(val),
      complete: () => console.log('completed!'),
      error: (err)=> console.log('error occured!', err),
    });
    const subscription = this.clickCount$.subscribe({
      next:(val) => console.log(`Clicked button ${this.clickCount()} times.`)
    })
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  onClick() {
    this.clickCount.update(prevCount => prevCount +1);
  }
}
