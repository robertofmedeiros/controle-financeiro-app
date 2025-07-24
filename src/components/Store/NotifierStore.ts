import { makeAutoObservable } from "mobx";
import { ReactNode } from "react";

interface INotifier {
  title: string;
  content: string | string[] | ReactNode;
  onClose: Function;
  timeOut: number;
}

class NotifierStore {
  private interval: any;
  private counter: number;
  private percent: number;
  private open: boolean;
  private showProgress: boolean;
  private notifier: INotifier;
  constructor() {
    this.notifier = {
      title: "",
      content: "",
      timeOut: 6000,
      onClose: () => { },
    };
    this.open = false;
    this.showProgress = false;
    this.interval = 0;
    this.counter = 0;
    this.percent = 0;
    makeAutoObservable(this);
  }

  public setNotifier(notifier: INotifier): void {
    this.notifier = notifier;
  }

  public getnotifier(): INotifier {
    return this.notifier;
  }

  public setOpen(open: boolean): void {
    this.open = open;
    this.startTimeOut();
  }

  public getOpen(): boolean {
    return this.open;
  }

  public getTitle(): string {
    return this.notifier.title;
  }

  public getContent(): string | string[] | ReactNode {
    return this.notifier.content;
  }

  public getOnClose() {
    return this.notifier.onClose();
  }

  public getPercent(): number {
    return this.percent;
  }

  setPercent(percent: number): void {
    this.percent = percent;
  }

  private startTimeOut() {
    clearInterval(this.interval);
    this.interval = 0;
    this.counter = 0;
    this.percent = 0;
    this.showProgress = true;
    this.interval = setInterval(() => {
      this.counter++;
      this.setPercent((this.counter * 100) / (this.notifier.timeOut / 200 - 1));
      if (this.counter >= this.notifier.timeOut / 200) {
        this.notifier.onClose();
        this.setOpen(false);
        this.stopTimer();
      }
    }, 200);
  }

  private stopTimer() {
    clearInterval(this.interval);
  }

  public onMouseEnter(): void {
    this.showProgress = false;
    this.setPercent(100);
    this.stopTimer();
  }

  public getShowProgress() {
    return this.showProgress;
  }
}

const notifierStore = new NotifierStore();
export { notifierStore };
