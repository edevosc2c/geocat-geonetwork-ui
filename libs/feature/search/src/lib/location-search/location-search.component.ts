import { ChangeDetectionStrategy, Component } from '@angular/core'
import { AutocompleteItem } from '@geonetwork-ui/ui/inputs'
import { LocationSearchService } from './location-search.service'
import { LocationBbox } from './location-search-result.model'
import { SearchFacade } from '../state/search.facade'
import { combineLatest, of } from 'rxjs'
import { map } from 'rxjs/operators'

@Component({
  selector: 'gn-ui-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationSearchComponent {
  currentLocation$ = combineLatest([
    this.searchFacade.locationFilterLabel$,
    this.searchFacade.locationFilterBbox$,
  ]).pipe(map(([label, bbox]) => ({ label, bbox })))

  constructor(
    private locationSearchService: LocationSearchService,
    private searchFacade: SearchFacade
  ) {}

  displayWithFn = (location: LocationBbox): string => {
    return location?.label
  }

  autoCompleteAction = (query: string) => {
    if (!query) return of([])
    return this.locationSearchService.queryLocations(query)
  }

  handleItemSelection(item: AutocompleteItem) {
    const location = item as LocationBbox
    this.searchFacade.setLocationFilter(location.label, location.bbox)
  }

  handleInputSubmission(inputValue: string) {
    if (inputValue === '') {
      this.searchFacade.clearLocationFilter()
      return
    }
    this.locationSearchService.queryLocations(inputValue).subscribe((item) => {
      if (item.length === 0) {
        console.warn('no location found')
        return
      }
      this.searchFacade.setLocationFilter(item[0].label, item[0].bbox)
    })
  }
}
