import { HttpClientModule } from '@angular/common/http'
import { MatIconModule } from '@angular/material/icon'
import { TranslateModule } from '@ngx-translate/core'
import {
  moduleMetadata,
  Story,
  Meta,
  componentWrapperDecorator,
} from '@storybook/angular'
import { TRANSLATE_DEFAULT_CONFIG } from '@geonetwork-ui/util/i18n'
import { UtilSharedModule } from '@geonetwork-ui/util/shared'
import { RecordThumbnailComponent } from '../record-thumbnail/record-thumbnail.component'
import { OrganisationPreviewComponent } from './organisation-preview.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

export default {
  title: 'Search/OrganisationPreviewComponent',
  component: OrganisationPreviewComponent,
  decorators: [
    moduleMetadata({
      declarations: [RecordThumbnailComponent],
      imports: [
        BrowserAnimationsModule,
        UtilSharedModule,
        HttpClientModule,
        MatIconModule,
        TranslateModule.forRoot(TRANSLATE_DEFAULT_CONFIG),
      ],
    }),
    componentWrapperDecorator(
      (story) => `<div style="max-width: 700px">${story}</div>`
    ),
  ],
} as Meta<OrganisationPreviewComponent>

const Template: Story<OrganisationPreviewComponent> = (
  args: OrganisationPreviewComponent
) => ({
  component: OrganisationPreviewComponent,
  props: args,
})

export const Primary = Template.bind({})
Primary.args = {
  title: 'Agglo du Saint Quentinois',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  logo: 'https://www.declic-mobilites.org/images/neoentreprises/e/65/agglomeration_du_saint_quentinois_00269100_120312697-20180412122249.png',
  nRecords: 12,
}
