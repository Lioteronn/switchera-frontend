import React, { useRef, useEffect } from "react";
import { View } from "react-native";
import {ExpoWebGLRenderingContext, GLView} from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";

const ROOM_WIDTH = 12;
const ROOM_DEPTH = 8;
const ROOM_HEIGHT = 4;
const VOXEL_SIZE = 0.2;

const VOXELS_X = Math.round(ROOM_WIDTH / VOXEL_SIZE);
const VOXELS_Y = Math.round(ROOM_HEIGHT / VOXEL_SIZE);
const VOXELS_Z = Math.round(ROOM_DEPTH / VOXEL_SIZE);

export default function ProfileRoom() {
    const timeout = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (timeout.current) clearTimeout(timeout.current);
        };
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <GLView
                style={{ flex: 1 }}
                onContextCreate={async (gl: ExpoWebGLRenderingContext) => {
                    const scene = new THREE.Scene();
                    scene.background = new THREE.Color(0xf8fafc);

                    const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
                    const d = ROOM_WIDTH / 2;
                    const camera = new THREE.OrthographicCamera(
                        -d * aspect,
                        d * aspect,
                        d,
                        -d,
                        0.1,
                        100
                    );
                    camera.position.set(60, 60, 60);
                    camera.lookAt(0, 0, 0);

                    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
                    scene.add(ambient);
                    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
                    dir.position.set(10, 20, 10);
                    scene.add(dir);

                    const geometry = new THREE.BoxGeometry(
                        VOXEL_SIZE,
                        VOXEL_SIZE,
                        VOXEL_SIZE
                    );

                    const materialFloorCeil = new THREE.MeshLambertMaterial({
                        color: 0xffffff,
                    });
                    const materialSideWalls = new THREE.MeshLambertMaterial({
                        color: 0xd1d5db,
                    });
                    const materialFrontBack = new THREE.MeshLambertMaterial({
                        color: 0x6b7280,
                    });

                    const dummy = new THREE.Object3D();

                    const addVoxelInstances = (
                        count: number,
                        transformFn: (dummy: THREE.Object3D, i: number) => void,
                        material: THREE.Material
                    ) => {
                        const mesh = new THREE.InstancedMesh(geometry, material, count);
                        for (let i = 0; i < count; i++) {
                            transformFn(dummy, i);
                            dummy.updateMatrix();
                            mesh.setMatrixAt(i, dummy.matrix);
                        }
                        scene.add(mesh);
                    };

                    // Suelo y techo
                    const floorCeilCount = VOXELS_X * VOXELS_Z * 2;
                    let idx = 0;
                    addVoxelInstances(
                        floorCeilCount,
                        (dummy: THREE.Object3D, i: number) => {
                            const x = idx % VOXELS_X;
                            const z = Math.floor((idx % (VOXELS_X * VOXELS_Z)) / VOXELS_X);
                            const y = idx < VOXELS_X * VOXELS_Z
                                ? -ROOM_HEIGHT / 2 + VOXEL_SIZE / 2 // suelo
                                : ROOM_HEIGHT / 2 - VOXEL_SIZE / 2; // techo
                            dummy.position.set(
                                x * VOXEL_SIZE - ROOM_WIDTH / 2 + VOXEL_SIZE / 2,
                                y,
                                z * VOXEL_SIZE - ROOM_DEPTH / 2 + VOXEL_SIZE / 2
                            );
                            idx++;
                        },
                        materialFloorCeil
                    );

                    // Paredes laterales
                    const sideWallCount = VOXELS_Y * VOXELS_Z * 2;
                    idx = 0;
                    addVoxelInstances(
                        sideWallCount,
                        (dummy: THREE.Object3D, i: number) => {
                            const y = idx % VOXELS_Y;
                            const z = Math.floor((idx % (VOXELS_Y * VOXELS_Z)) / VOXELS_Y);
                            const x = idx < VOXELS_Y * VOXELS_Z
                                ? -ROOM_WIDTH / 2 + VOXEL_SIZE / 2 // izquierda
                                : ROOM_WIDTH / 2 - VOXEL_SIZE / 2; // derecha
                            dummy.position.set(
                                x,
                                y * VOXEL_SIZE - ROOM_HEIGHT / 2 + VOXEL_SIZE / 2,
                                z * VOXEL_SIZE - ROOM_DEPTH / 2 + VOXEL_SIZE / 2
                            );
                            idx++;
                        },
                        materialSideWalls
                    );

                    // Paredes frontal y trasera
                    const frontBackCount = VOXELS_X * VOXELS_Y * 2;
                    idx = 0;
                    addVoxelInstances(
                        frontBackCount,
                        (dummy: THREE.Object3D, i: number) => {
                            const x = idx % VOXELS_X;
                            const y = Math.floor((idx % (VOXELS_X * VOXELS_Y)) / VOXELS_X);
                            const z = idx < VOXELS_X * VOXELS_Y
                                ? -ROOM_DEPTH / 2 + VOXEL_SIZE / 2 // frontal
                                : ROOM_DEPTH / 2 - VOXEL_SIZE / 2; // trasera
                            dummy.position.set(
                                x * VOXEL_SIZE - ROOM_WIDTH / 2 + VOXEL_SIZE / 2,
                                y * VOXEL_SIZE - ROOM_HEIGHT / 2 + VOXEL_SIZE / 2,
                                z
                            );
                            idx++;
                        },
                        materialFrontBack
                    );

                    const renderer = new Renderer({ gl });
                    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

                    const render = () => {
                        renderer.render(scene, camera);
                        gl.endFrameEXP();
                        timeout.current = setTimeout(render, 16);
                    };
                    render();
                }}
            />
        </View>
    );
}