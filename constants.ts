import { RadioStation, NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Indian Channels', href: '#indian-channels' },
  { label: 'Search', href: '#search' },
  { label: 'Visualize', href: '#visualize' },
  { label: 'Trending', href: '#trending' },
];

export const RADIO_STATIONS: RadioStation[] = [
  // --- Indian Channels (Verified High-Availability MP3) ---
  { 
    id: 'in-city1016', 
    name: 'City 101.6 FM', 
    genre: 'Bollywood Hits', 
    location: 'Dubai/India', 
    coordinates: [72.8777, 19.0760], 
    listeners: '3.5M', 
    logo: 'https://picsum.photos/100/100?random=1', 
    isIndian: true, 
    isTrending: true,
    streamUrl: 'https://icecast.arn.ae/city1016.mp3'
  },
  { 
    id: 'in-gold1013', 
    name: 'Gold 101.3 FM', 
    genre: 'Classic Bollywood', 
    location: 'Mumbai, India', 
    coordinates: [72.8258, 18.9750], 
    listeners: '2.1M', 
    logo: 'https://picsum.photos/100/100?random=5', 
    isIndian: true, 
    streamUrl: 'https://icecast.arn.ae/gold1013.mp3'
  },
  { 
    id: 'in-hit967', 
    name: 'Hit 96.7 FM', 
    genre: 'Malayalam Hits', 
    location: 'Kochi/Dubai', 
    coordinates: [76.2673, 9.9312], 
    listeners: '1.2M', 
    logo: 'https://picsum.photos/100/100?random=2', 
    isIndian: true, 
    isTrending: true,
    streamUrl: 'https://icecast.arn.ae/hit967.mp3'
  },
  { 
    id: 'in-suno', 
    name: 'Suno 1024', 
    genre: 'Hindi/Urdu Hits', 
    location: 'India/UAE', 
    coordinates: [75.8573, 30.9010], 
    listeners: '400K', 
    logo: 'https://picsum.photos/100/100?random=6', 
    isIndian: true,
    streamUrl: 'https://icecast.arn.ae/suno1024.mp3'
  },
  { 
    id: 'in-taal', 
    name: 'Radio Taal', 
    genre: 'Desi Mix', 
    location: 'Bangalore, India', 
    coordinates: [77.5946, 12.9716], 
    listeners: '300K', 
    logo: 'https://picsum.photos/100/100?random=29', 
    isIndian: true,
    streamUrl: 'https://s2.radio.co/s9326e5e8e/listen'
  },
  {
    id: 'in-boxout',
    name: 'Boxout.fm',
    genre: 'Electronic, Indie',
    location: 'New Delhi, India',
    coordinates: [77.2090, 28.6139],
    listeners: '150K',
    logo: 'https://picsum.photos/100/100?random=12', 
    isIndian: true,
    isTrending: true,
    streamUrl: 'https://boxoutfm.out.airtime.pro/boxoutfm_a'
  },
  {
    id: 'in-mirchi',
    name: 'Radio Mirchi 98.3 FM',
    genre: 'Bollywood Hits',
    location: 'Mumbai, India',
    coordinates: [72.8777, 19.0760],
    listeners: '4M',
    logo: 'https://picsum.photos/100/100?random=66',
    isIndian: true,
    isTrending: true,
    streamUrl: 'https://eu8.fastcast4u.com/proxy/clyedupq?mp=%2F1?aw_0_req_lsid=2c0fae177108c9a42a7cf24878625444'
  },
  {
    id: 'in-bigfm',
    name: '92.7 BIG FM',
    genre: 'Bollywood Hits',
    location: 'Delhi, India',
    coordinates: [77.1025, 28.7041],
    listeners: '3.2M',
    logo: 'https://picsum.photos/100/100?random=67',
    isIndian: true,
    streamUrl: 'https://stream-153.zeno.fm/dbstwo3dvhhtv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJkYnN0d28zZHZoaHR2IiwiaG9zdCI6InN0cmVhbS0xNTMuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6IjJyUWZmd1JYUVMya2VDTnZrUUdUd3ciLCJpYXQiOjE3NjQ1MTk1MzUsImV4cCI6MTc2NDUxOTU5NX0.Q_YZ9SPgH0RsNuefkVT1V_1Befc_SFOjIAxaMAQp-Bw'
  },
  {
    id: 'in-vividh',
    name: 'Vividh Bharati',
    genre: 'All-India Mix',
    location: 'Gujarat, India',
    coordinates: [72.63, 23.2156],
    listeners: '2M',
    logo: 'https://picsum.photos/100/100?random=68',
    isIndian: true,
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8'
  },
  {
    id: 'in-airfm',
    name: 'AIR FM Gold',
    genre: 'Classical & Classics',
    location: 'New Delhi, India',
    coordinates: [77.1025, 28.7041],
    listeners: '1.8M',
    logo: 'https://picsum.photos/100/100?random=69',
    isIndian: true,
    streamUrl: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio00564kbps.m3u8'
  },
  {
    id: 'in-redfm',
    name: '93.5 Red FM',
    genre: 'Bollywood Hits',
    location: 'Punjab, India',
    coordinates: [76.7794, 30.7333],
    listeners: '2.5M',
    logo: 'https://picsum.photos/100/100?random=70',
    isIndian: true,
    streamUrl: 'https://stream.zeno.fm/9phrkb1e3v8uv'
  },
  {
    id: 'in-airjammu',
    name: 'All India Radio AIR Jammu',
    genre: 'Indian Mix',
    location: 'Jammu, India',
    coordinates: [74.8570, 32.7266],
    listeners: '1.1M',
    logo: 'https://picsum.photos/100/100?random=71',
    isIndian: true,
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio128/playlist.m3u8'
  },
  {
    id: 'in-srinagar',
    name: 'AIR Srinagar 1116',
    genre: 'News & Culture',
    location: 'Srinagar, India',
    coordinates: [74.7973, 34.0837],
    listeners: '800K',
    logo: 'https://picsum.photos/100/100?random=72',
    isIndian: true,
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio136/playlist.m3u8'
  },
  {
    id: 'in-kashmir',
    name: 'AIR Kashmir 1350',
    genre: 'Regional Mix',
    location: 'Kashmir, India',
    coordinates: [74.2581, 34.4670],
    listeners: '650K',
    logo: 'https://picsum.photos/100/100?random=73',
    isIndian: true,
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio136/playlist.m3u8'
  },

  // --- North America ---
  {
    id: 'gl-wfmu',
    name: 'WFMU',
    genre: 'Freeform',
    location: 'New Jersey, USA',
    coordinates: [-74.0776, 40.7282],
    listeners: '200K',
    logo: 'https://picsum.photos/100/100?random=20',
    streamUrl: 'https://stream.wfmu.org/freeform-128k'
  },
  {
    id: 'gl-dublab',
    name: 'Dublab',
    genre: 'Future Beats',
    location: 'Los Angeles, USA',
    coordinates: [-118.2437, 34.0522],
    listeners: '120K',
    logo: 'https://picsum.photos/100/100?random=21',
    streamUrl: 'https://dublab.out.airtime.pro/dublab_a'
  },
  { 
    id: '8', 
    name: 'KEXP', 
    genre: 'Alternative', 
    location: 'Seattle, USA', 
    coordinates: [-122.3321, 47.6062], 
    listeners: '300K', 
    logo: 'https://picsum.photos/100/100?random=8',
    streamUrl: 'https://kexp-mp3-128.ihrhls.com/4728'
  },
  {
    id: 'gl-somafm',
    name: 'SomaFM: Groove',
    genre: 'Ambient',
    location: 'San Francisco, USA',
    coordinates: [-122.4194, 37.7749],
    listeners: '450K',
    logo: 'https://picsum.photos/100/100?random=12',
    streamUrl: 'https://ice2.somafm.com/groovesalad-128-mp3'
  },
  {
    id: 'gl-radioparadise',
    name: 'Radio Paradise',
    genre: 'Eclectic Rock',
    location: 'California, USA',
    coordinates: [-121.4944, 38.5816],
    listeners: '600K',
    logo: 'https://picsum.photos/100/100?random=13',
    streamUrl: 'https://stream.radioparadise.com/mellow-128'
  },
  {
    id: 'gl-181fm',
    name: '181.fm Power',
    genre: 'Top 40',
    location: 'Virginia, USA',
    coordinates: [-78.88, 38.06],
    listeners: '1M',
    logo: 'https://picsum.photos/100/100?random=32',
    streamUrl: 'https://listen.181fm.com/181-power_128k.mp3'
  },

  // --- South America ---
  {
    id: 'gl-bossanova',
    name: 'Bossa Jazz',
    genre: 'Jazz/Samba',
    location: 'Rio, Brazil',
    coordinates: [-43.1729, -22.9068],
    listeners: '250K',
    logo: 'https://picsum.photos/100/100?random=22',
    streamUrl: 'https://icecast.walmradio.com:8000/bossa' 
  },

  // --- Europe ---
  { 
    id: '7', 
    name: 'Capital UK', 
    genre: 'Pop, Top 40', 
    location: 'London, UK', 
    coordinates: [-0.1278, 51.5074], 
    listeners: '5M', 
    logo: 'https://picsum.photos/100/100?random=7', 
    isTrending: true,
    streamUrl: 'https://media-ssl.musicradio.com/CapitalMP3'
  },
  {
    id: 'gl-classicfm',
    name: 'Classic FM',
    genre: 'Classical',
    location: 'London, UK',
    coordinates: [-0.14, 51.51],
    listeners: '4.5M', 
    logo: 'https://picsum.photos/100/100?random=33',
    streamUrl: 'https://media-ssl.musicradio.com/ClassicFMMP3'
  },
  { 
    id: '10', 
    name: 'FIP Main', 
    genre: 'Eclectic', 
    location: 'Paris, France', 
    coordinates: [2.3522, 48.8566], 
    listeners: '400K', 
    logo: 'https://picsum.photos/100/100?random=10',
    streamUrl: 'https://icecast.radiofrance.fr/fip-midfi.mp3'
  },
  {
    id: 'gl-ibiza',
    name: 'Ibiza Global',
    genre: 'House',
    location: 'Ibiza, Spain',
    coordinates: [1.432, 38.906],
    listeners: '1.2M', 
    logo: 'https://picsum.photos/100/100?random=14',
    isTrending: true,
    streamUrl: 'https://listenssl.ibizaglobalradio.com:8024/ibizaglobalradio.mp3'
  },
  {
    id: 'gl-nts',
    name: 'NTS Radio',
    genre: 'Underground',
    location: 'London, UK',
    coordinates: [-0.076, 51.543],
    listeners: '900K',
    logo: 'https://picsum.photos/100/100?random=15',
    streamUrl: 'https://stream-relay-geo.ntslive.co.uk/stream'
  },

  // --- Africa & Middle East ---
  {
    id: 'gl-virgin',
    name: 'Virgin Radio',
    genre: 'Global Hits',
    location: 'Dubai/UAE',
    coordinates: [55.2708, 25.2048],
    listeners: '550K',
    logo: 'https://picsum.photos/100/100?random=27',
    isTrending: true,
    streamUrl: 'https://icecast.arn.ae/virginradio.mp3'
  },

  // --- Asia ---
  { 
    id: 'gl-tag911', 
    name: 'Tag 91.1', 
    genre: 'Asian Mix', 
    location: 'Manila/Dubai', 
    coordinates: [120.9842, 14.5995], 
    listeners: '1.8M', 
    logo: 'https://picsum.photos/100/100?random=9',
    streamUrl: 'https://icecast.arn.ae/tag911.mp3'
  },

  // --- Australia ---
  { 
    id: '11', 
    name: 'Triple J', 
    genre: 'Indie', 
    location: 'Sydney, Aus',
    coordinates: [151.2093, -33.8688], 
    listeners: '1.1M', 
    logo: 'https://picsum.photos/100/100?random=11',
    streamUrl: 'https://live-radio01.mediahubaustralia.com/2TJW/mp3/'
  }
];