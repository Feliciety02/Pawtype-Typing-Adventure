"use client"
import { Text } from "@react-three/drei"
import type { KeyPosition } from "../layout-data"
import type { KeyCustomization } from "../types"

type Props = {
  positions: KeyPosition[]
  keys: Record<string, KeyCustomization>
  explodeOffset?: number
}

export function KeycapLegendLayer({ positions, keys, explodeOffset = 0 }: Props) {
  return (
    <group position={[0, explodeOffset, 0]}>
      {positions.map((pos) => {
        const key = keys[pos.keyId]
        if (!key?.legend?.visible) return null
        const legend = key.legend
        if (!legend.text) return null

        const fontSize = Math.min(pos.width, pos.depth) * legend.size * 0.42
        const yOffset = pos.height + 0.005

        return (
          <Text
            key={pos.keyId}
            position={[pos.x, yOffset, -pos.y]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={fontSize}
            color={legend.color}
            anchorX="center"
            anchorY="middle"
            font="/fonts/Geist-Bold.ttf"
            maxWidth={pos.width * 0.85}
            overflowWrap="break-word"
          >
            {legend.text.length > 4 ? legend.text.slice(0, 4) : legend.text}
          </Text>
        )
      })}
    </group>
  )
}
