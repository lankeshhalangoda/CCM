/**
 * Sri Lanka Map Configuration
 * This file contains the map data and configuration for the Sri Lanka complaint density map
 */

// Sri Lanka district codes and complaint data
const sriLankaMapData = [
    ['lk-bc', 45], // Badulla
    ['lk-mb', 52], // Matale
    ['lk-ja', 38], // Jaffna
    ['lk-kl', 68], // Kalutara
    ['lk-ky', 42], // Kandy
    ['lk-mt', 55], // Matara
    ['lk-nw', 48], // Nuwara Eliya
    ['lk-ap', 62], // Ampara
    ['lk-pr', 35], // Puttalam
    ['lk-tc', 58], // Trincomalee
    ['lk-ad', 41], // Anuradhapura
    ['lk-va', 49], // Vavuniya
    ['lk-mp', 53], // Mannar
    ['lk-kg', 46], // Kegalle
    ['lk-px', 39], // Polonnaruwa
    ['lk-rn', 44], // Ratnapura
    ['lk-gl', 51], // Galle
    ['lk-hb', 37], // Hambantota
    ['lk-mh', 56], // Moneragala
    ['lk-bd', 43], // Batticaloa
    ['lk-mj', 47], // Mullaitivu
    ['lk-ke', 50], // Kurunegala
    ['lk-co', 54], // Colombo
    ['lk-gq', 40], // Gampaha
    ['lk-kt', 45]  // Kilinochchi
];

// Map configuration
const sriLankaMapConfig = {
    topologyUrl: 'https://code.highcharts.com/mapdata/countries/lk/lk-all.topo.json',
    colorAxis: {
        min: 0,
        minColor: '#E5F0FF',
        maxColor: '#14B8A6'
    },
    hoverColor: '#BADA55',
    dataLabels: {
        enabled: true,
        format: '{point.name}'
    }
};

