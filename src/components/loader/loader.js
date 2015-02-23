// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('base_object')
var PlayerInfo = require('player_info')
var uniq = require('lodash.uniq')
var union = require('lodash.union')

/* Playback Plugins */
var HTML5VideoPlayback = require('html5_video');

/* Container Plugins */
var SpinnerThreeBouncePlugin = require('../../plugins/spinner_three_bounce');
var StatsPlugin = require('../../plugins/stats');
var WaterMarkPlugin = require('../../plugins/watermark');
var PosterPlugin = require('poster');
var GoogleAnalyticsPlugin = require('../../plugins/google_analytics');
var ClickToPausePlugin = require('../../plugins/click_to_pause');

/* Core Plugins */
var DVRControls = require('../../plugins/dvr_controls');

class Loader extends BaseObject {
  constructor(externalPlugins) {
    super()
    this.playbackPlugins = [HTML5VideoPlayback]
    this.containerPlugins = [SpinnerThreeBouncePlugin, WaterMarkPlugin, PosterPlugin, StatsPlugin, GoogleAnalyticsPlugin, ClickToPausePlugin]
    this.corePlugins = [DVRControls]
    if (externalPlugins) {
      this.addExternalPlugins(externalPlugins)
    }
  }

  addExternalPlugins(plugins) {
    var pluginName = function(plugin) { return plugin.prototype.name }
    if (plugins.playback) { this.playbackPlugins = uniq(plugins.playback.concat(this.playbackPlugins), pluginName) }
    if (plugins.container) { this.containerPlugins = uniq(plugins.container.concat(this.containerPlugins), pluginName) }
    if (plugins.core) { this.corePlugins = uniq(plugins.core.concat(this.corePlugins), pluginName) }
    PlayerInfo.playbackPlugins = this.playbackPlugins
  }

  getPlugin(name) {
    var allPlugins = union(this.containerPlugins, this.playbackPlugins, this.corePlugins)
    return allPlugins.find((plugin) => { return plugin.prototype.name === name })
  }
}

module.exports = Loader;
