import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import EventEmitter from './EventEmitter'


export default class Loader extends EventEmitter {

  constructor() {
    super()

    this._items = {}

    this.loaders = null
    this.renderer = null
    this.manager = new THREE.LoadingManager()

    this.manager.onStart = (url, itemsLoaded, itemsTotal) => this.onStart(itemsLoaded, itemsTotal)
    this.manager.onLoad = () => this.onLoad()
    this.manager.onProgress = (url, itemsLoaded, itemsTotal) => this.onProgress(itemsLoaded, itemsTotal)
    this.manager.onError = (url) => this.onError(url)
  }

  setLoaders() {
    this.loaders = []

    // Images
    const textureLoader = new THREE.TextureLoader(this.manager)

    this.loaders.push({
      extensions: ['jpg', 'png'],
      action: (source) => {
        textureLoader.load(source.path, file => {
          this._items[source.name] = file
        })
      }
    })

    // Draco
    const dracoLoader = new DRACOLoader(this.manager)
    dracoLoader.setDecoderPath('draco/')
    dracoLoader.setDecoderConfig({ type: 'js' })

    this.loaders.push({
      extensions: ['drc'],
      action: (source) => {
        dracoLoader.load(source.path, file => {
          this._items[source.name] = file
          DRACOLoader.releaseDecoderModule()
        })
      }
    })

    // GLTF
    const gltfLoader = new GLTFLoader(this.manager)
    gltfLoader.setDRACOLoader(dracoLoader)

    this.loaders.push({
      extensions: ['glb', 'gltf'],
      action: (source) => {
        gltfLoader.load(source.path, file => {
          this._items[source.name] = file
        })
      }
    })

    // FBX
    const fbxLoader = new FBXLoader(this.manager)

    this.loaders.push({
      extensions: ['fbx'],
      action: (source) => {
        fbxLoader.load(source.path, file => {
          this._items[source.name] = file
        })
      }
    })

    // RGBE | HDR
    const rgbeLoader = new RGBELoader(this.manager)

    this.loaders.push({
      extensions: ['hdr'],
      action: (source) => {
        rgbeLoader.load(source.path, file => {
          this._items[source.name] = file
        })
      }
    })
  }

  getItem(name) {
    return this._items[name]
  }

  onStart(loaded, total) {
    this.emit('start', { loaded, total })
  }

  onLoad() {
    this.emit('load')
  }

  onProgress(loaded, total) {
    this.emit('progress', { loaded, total })
  }

  onError(url) {
    this.emit('error', { url })
  }

  load(sources = []) {
    if (sources.length < 1) {
      setTimeout(() => {
        this.onLoad()
      }, 0)
    } else {
      if (!this.loaders) this.setLoaders()

      for (const source of sources) {
        const extension = source.path.match(/\.([a-z]+)$/)

        if (typeof extension[1] !== 'undefined') {
          const loader = this.loaders.find(l => l.extensions.find(e => e === extension[1]))

          if (loader) {
            loader.action(source)
          } else {
            throw new Error(`Cannot found loader for ${ source.name }`)
          }
        } else {
          throw new Error(`Cannot found extension of ${ source.name }`)
        }
      }
    }

    return this
  }

}