# Rangodon

<!-- STORY -->

| Name               | Type     | Default  | Required | Description                                                                                                                           |
|:-------------------|:--------:|:--------:|:--------:|---------------------------------------------------------------------------------------------------------------------------------------|
| max | number  | 100    |          | Max range value |
| min | number  | 0    |          | Min range value |
| onChange | function  | () => {} |          | Fired when range slider value changes. Receives the value of the slider or a mapped value. |
| onMouseDown | function  | () => {} |          | Fired on press down over the slider component |
| onMouseUp | function  | () => {} |          | Fired on press up over the slider component |
| rangeMap | object  |  {} |          | Used to map non-number values to slider values. Slider values should be used as the keys. |
| step | string  | "any" |          | Used to define slider value increments between the max and min values. If set, the slider will jump to each incremental value. |
| value | number  | null |          | If set, the component is considered a controlled component and the value should be controlled through a parent. The parent would use the `onChange` property to determine what value to set. |

## Usage

Import `Rangodon` and `RangodonTrack` for the basic slider. The two main components are separate so the track can have its styles more easily extended as well as allow for any internal components of the `Rangodon` to use `Context`.

```js
<Rangodon>
    <RangodonTrack />
</Rangodon>
```

## Customizing

What you actually see isn't the real `input[range]` element that's being interacted with and running the component value. This is because styling the real `input[range]` is very limited and can be more limited in certain browsers. The `input` is positioned invisibly over top normal `div` elements that represent the visual parts of the `Rangodon`. There are a couple of ways of customizing the visual elements.

- Import `RangodonTrack` and extend through a styled component. `const CustomTrack = styled(RangodonTrack)`
- Import the `withRangodonContext` higher order component and use the values passed in to position the slider handle and track.

### Markers

Adding markers to a `Rangodon` is simple. Add `RangodonMarker`s as children of the `RangodonTrack` with `at` props and marker content if desired. You can also create a custom track with embedded markers but this is a less flexible solution. The `at` prop on a marker is the value you want to mark on the track.

```js
<Rangodon step={25}>
    <RangodonTrack>
        <RangodonMarker at={0}>0</RangodonMarker>
        <RangodonMarker at={25}>25</RangodonMarker>
        <RangodonMarker at={50}>50</RangodonMarker>
        <RangodonMarker at={75}>75</RangodonMarker>
        <RangodonMarker at={100}>100</RangodonMarker>
    </RangodonTrack>
</Rangodon>
```
