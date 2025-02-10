import { ResponsiveNetwork, NetworkDataProps } from '@nivo/network'
import { NetworkNode, NetworkLink } from './types'

const theme = {
  background: '#fff',
  tooltip: {
    container: {
      color: 'black',
    }
  }
}

const Network = ({ data }: NetworkDataProps<NetworkNode, NetworkLink>) => (
    <ResponsiveNetwork
        theme={theme}
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        linkDistance={e=>e.distance}
        nodeColor={e=>e.color}
        linkColor="rgb(255, 230, 0)"
        repulsivity={200}
        centeringStrength={0.5}
    />
)

export default Network