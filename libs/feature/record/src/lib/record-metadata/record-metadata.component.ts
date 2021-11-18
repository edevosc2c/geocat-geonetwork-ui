import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MapManagerService } from '@geonetwork-ui/feature/map'
import { MdViewFacade } from '../state/mdview.facade'
import { map } from 'rxjs/operators'
import { combineLatest } from 'rxjs'

@Component({
  selector: 'gn-ui-record-metadata',
  templateUrl: './record-metadata.component.html',
  styleUrls: ['./record-metadata.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordMetadataComponent {
  displayMap$ = combineLatest([
    this.facade.mapApiLinks$,
    this.facade.dataLinks$,
  ]).pipe(
    map(
      ([mapLinks, dataLinks]) =>
        (!!mapLinks && mapLinks.length > 0) ||
        (!!dataLinks && dataLinks.length > 0)
    )
  )
  displayData$ = this.facade.dataLinks$.pipe(
    map((links) => !!links && links.length > 0)
  )
  displayDownload$ = this.facade.downloadLinks$.pipe(
    map((links) => !!links && links.length > 0)
  )
  displayApi$ = this.facade.apiLinks$.pipe(
    map((links) => !!links && links.length > 0)
  )

  constructor(
    public facade: MdViewFacade,
    private mapManager: MapManagerService
  ) {}

  onTabIndexChange(): void {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 0)
  }
}
