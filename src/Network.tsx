import { ResponsiveNetwork, NetworkDataProps } from '@nivo/network'
import { NetworkNode, NetworkLink } from './types'

const theme = {
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
        nodeBorderWidth={1}
        linkBlendMode="multiply"
        motionConfig="wobbly"
    />
)

export default Network