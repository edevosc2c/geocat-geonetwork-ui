import fetchMock from 'fetch-mock-jest'
import {
  _reset,
  getCustomTranslations,
  getGlobalConfig,
  getThemeConfig,
  loadAppConfig,
  getOptionalMapConfig,
  getOptionalSearchConfig,
} from './app-config'
import {
  CONFIG_MALFORMED,
  CONFIG_MINIMAL,
  CONFIG_MISSING_MANDATORY,
  CONFIG_OK,
  CONFIG_UNRECOGNIZED_KEYS,
  CONFIG_WRONG_LANGUAGE_CODE,
} from './fixtures'

describe('app config utils', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn')
    fetchMock.reset()
    _reset()
  })
  describe('when the configuration file is missing', () => {
    beforeEach(() => {
      fetchMock.get('end:default.toml', () => ({ status: 404 }))
    })
    describe('loadAppConfig', () => {
      it('throws an error', async () => {
        await expect(loadAppConfig()).rejects.toThrowError(
          'could not be loaded'
        )
      })
    })
    describe('getGlobalConfig', () => {
      it('throws an error', async () => {
        await loadAppConfig().catch(() => {}) // eslint-disable-line
        expect(() => getGlobalConfig()).toThrowError('not initialized')
      })
    })
  })
  describe('when the configuration file is malformed', () => {
    beforeEach(() => {
      fetchMock.get('end:default.toml', () => CONFIG_MALFORMED)
    })
    describe('loadAppConfig', () => {
      it('throws an error', async () => {
        await expect(loadAppConfig()).rejects.toThrowError(
          'error occurred when parsing'
        )
      })
    })
    describe('getGlobalConfig', () => {
      it('throws an error', async () => {
        await loadAppConfig().catch(() => {}) // eslint-disable-line
        expect(() => getGlobalConfig()).toThrowError('not initialized')
      })
    })
  })
  describe('when the configuration file misses mandatory keys', () => {
    beforeEach(() => {
      fetchMock.get('end:default.toml', () => CONFIG_MISSING_MANDATORY)
    })
    describe('loadAppConfig', () => {
      it('throws an error (only for sections with mandatory properties)', async () => {
        await expect(loadAppConfig()).rejects.toThrow(
          /(?=.*\[global] mandatory section is missing)(?=.*main_color)/s
        )
      })
    })
    describe('getGlobalConfig', () => {
      it('throws an error', async () => {
        await loadAppConfig().catch(() => {}) // eslint-disable-line
        expect(() => getGlobalConfig()).toThrowError('not initialized')
      })
    })
  })
  describe('when the metadata_language key has a wrong value', () => {
    beforeEach(async () => {
      fetchMock.get('end:default.toml', () => CONFIG_WRONG_LANGUAGE_CODE)
      await loadAppConfig()
    })
    describe('loadAppConfig', () => {
      it('logs a warning', () => {
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringMatching(/(?=.*metadata_language = "fra")/)
        )
      })
    })
    describe('getGlobalConfig', () => {
      it('returns the global config', () => {
        expect(getGlobalConfig()).toEqual({
          GN4_API_URL: '/geonetwork/srv/api',
          PROXY_PATH: '/proxy/?url=',
          METADATA_LANGUAGE: 'fra',
        })
      })
    })
  })
  describe('when the configuration file contains unrecognized keys', () => {
    beforeEach(async () => {
      fetchMock.get('end:default.toml', () => CONFIG_UNRECOGNIZED_KEYS)
      await loadAppConfig()
    })
    describe('loadAppConfig', () => {
      it('logs a warning', () => {
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringMatching(/(?=.*another_path)(?=.*another_color)/s)
        )
      })
    })
    describe('getGlobalConfig', () => {
      it('returns the global config', () => {
        expect(getGlobalConfig()).toEqual({
          GN4_API_URL: '/geonetwork/srv/api',
          PROXY_PATH: '/proxy/?url=',
          METADATA_LANGUAGE: 'fre',
        })
      })
    })
  })
  describe('when the configuration file is valid', () => {
    beforeEach(async () => {
      fetchMock.get('end:default.toml', () => CONFIG_OK)
      await loadAppConfig()
    })
    describe('getGlobalConfig', () => {
      it('returns the global config', () => {
        expect(getGlobalConfig()).toEqual({
          GN4_API_URL: '/geonetwork/srv/api',
          PROXY_PATH: '/proxy/?url=',
          METADATA_LANGUAGE: 'fre',
          LOGIN_URL: '/cas/login?service=',
          WEB_COMPONENT_EMBEDDER_URL: '/datahub/wc-embedder.html',
        })
      })
    })
    describe('getThemeConfig', () => {
      it('returns the theme config', () => {
        expect(getThemeConfig()).toEqual({
          BACKGROUND_COLOR: '#fdfbff',
          MAIN_COLOR: '#212029',
          MAIN_FONT: 'sans-serif',
          PRIMARY_COLOR: '#093564',
          SECONDARY_COLOR: '#c2e9dc',
          TITLE_FONT: 'serif',
          FONTS_STYLESHEET_URL:
            'https://fonts.googleapis.com/css2?family=Open+Sans',
          HEADER_BACKGROUND: 'teal',
          HEADER_FOREGROUND_COLOR: '#872e2e',
          THUMBNAIL_PLACEHOLDER: 'assets/img/placeholder.svg',
        })
      })
    })
    describe('getOptionalSearchConfig', () => {
      it('returns the search config', () => {
        expect(getOptionalSearchConfig()).toEqual({
          FILTER_GEOMETRY_URL: 'https://my.domain.org/geom.json',
        })
      })
    })
    describe('getCustomTranslations', () => {
      it('returns the custom translations for one language', () => {
        expect(getCustomTranslations('en')).toEqual({
          'my.first.key': 'First label.',
          'my.second.key': 'Second label,\non two lines.',
        })
        expect(getCustomTranslations('de')).toEqual({
          'my.first.key': 'Erste Etikett.',
        })
        expect(getCustomTranslations('fr')).toEqual({
          'my.sample.text': 'Un bon exemple de texte.',
          'my.quoted.text': 'du texte entre guillements.',
        })
      })
      it('returns an empty object if no translation defined', () => {
        expect(getCustomTranslations('nl')).toEqual({})
      })
    })
  })
  describe('minimal config', () => {
    beforeEach(async () => {
      fetchMock.get('end:default.toml', () => CONFIG_MINIMAL)
      await loadAppConfig()
    })
    describe('loadAppConfig', () => {
      it('does not throw an error', () => {
        expect(getGlobalConfig()).toEqual({
          GN4_API_URL: '/geonetwork/srv/api',
          PROXY_PATH: '/proxy/?url=',
        })
      })
    })
    describe('getGlobalConfig', () => {
      it('returns config', () => {
        expect(getGlobalConfig()).toEqual({
          GN4_API_URL: '/geonetwork/srv/api',
          PROXY_PATH: '/proxy/?url=',
        })
      })
    })
    describe('getThemeConfig', () => {
      it('returns config', () => {
        expect(getThemeConfig()).toEqual({
          BACKGROUND_COLOR: '#fdfbff',
          MAIN_COLOR: '#212029',
          PRIMARY_COLOR: '#093564',
          SECONDARY_COLOR: '#c2e9dc',
        })
      })
    })
    describe('getOptionalMapConfig', () => {
      it('returns null', () => {
        expect(getOptionalMapConfig()).toEqual(null)
      })
    })
    describe('getOptionalSearchConfig', () => {
      it('returns null', () => {
        expect(getOptionalSearchConfig()).toEqual(null)
      })
    })
  })

  describe('getOptionalMapConfig', () => {
    const baseConfig = `
    [global]
    geonetwork4_api_url = "/geonetwork/srv/api"
    [theme]
    primary_color = "#093564"
    secondary_color = "#c2e9dc"
    main_color = "#212029" # All-purpose text color
    background_color = "#fdfbff"
    header_background = 'blue'
    thumbnail_placeholder = 'assets/img/placeholder.svg'
`

    describe('when all properties are present', () => {
      beforeEach(async () => {
        fetchMock.get(
          'end:default.toml',
          () =>
            baseConfig +
            `
            [map]
            max_zoom = 10
            max_extent = [-418263.418776, 5251529.591305, 961272.067714, 6706890.609855]
            do_not_use_default_basemap = true
            external_viewer_url_template = 'https://example.com/myviewer?'
            external_viewer_open_new_tab = true
            [[map_layer]]
            type = "wms"
            url = "https://www.geo2france.fr/geoserver/cr_hdf/ows"
            name = "masque_hdf_ign_carto_latin1"
            [[map_layer]]
            type = "wfs"
            url = "https://www.geo2france.fr/geoserver/cr_hdf/ows"
            name = "masque_hdf_ign_carto_latin1"`
        )
        await loadAppConfig()
      })

      it('returns the map config', () => {
        expect(getOptionalMapConfig()).toEqual({
          MAX_ZOOM: 10,
          MAX_EXTENT: [
            -418263.418776, 5251529.591305, 961272.067714, 6706890.609855,
          ],
          DO_NOT_USE_DEFAULT_BASEMAP: true,
          EXTERNAL_VIEWER_URL_TEMPLATE: 'https://example.com/myviewer?',
          EXTERNAL_VIEWER_OPEN_NEW_TAB: true,
          MAP_LAYERS: [
            {
              TYPE: 'wms',
              URL: 'https://www.geo2france.fr/geoserver/cr_hdf/ows',
              NAME: 'masque_hdf_ign_carto_latin1',
            },
            {
              TYPE: 'wfs',
              URL: 'https://www.geo2france.fr/geoserver/cr_hdf/ows',
              NAME: 'masque_hdf_ign_carto_latin1',
            },
          ],
        })
      })
    })
    describe('when all properties are missing', () => {
      beforeEach(async () => {
        fetchMock.get(
          'end:default.toml',
          () =>
            baseConfig +
            `
            [map]`
        )
        await loadAppConfig()
      })

      it('returns the map config', () => {
        expect(getOptionalMapConfig()).toEqual({
          MAX_ZOOM: undefined,
          MAX_EXTENT: undefined,
          EXTERNAL_VIEWER_URL_TEMPLATE: undefined,
          EXTERNAL_VIEWER_OPEN_NEW_TAB: undefined,
          DO_NOT_USE_DEFAULT_BASEMAP: false,
          MAP_LAYERS: [],
        })
      })
    })
  })
})
